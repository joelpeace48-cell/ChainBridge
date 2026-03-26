use crate::error::Error;
use crate::storage;
use crate::types::{Chain, SwapOrder};
use soroban_sdk::{Address, Env, String};

pub fn create_order(
    env: &Env,
    creator: &Address,
    from_chain: Chain,
    to_chain: Chain,
    from_asset: String,
    to_asset: String,
    from_amount: i128,
    to_amount: i128,
    expiry: u64,
) -> Result<u64, Error> {
    if storage::is_paused(env) {
        return Err(Error::Paused);
    }

    if from_amount <= 0 || to_amount <= 0 {
        return Err(Error::InvalidAmount);
    }

    let current_time = env.ledger().timestamp();
    if expiry <= current_time {
        return Err(Error::InvalidTimelock);
    }

    let order_id = storage::increment_order_counter(env);

    let order = SwapOrder {
        id: order_id,
        creator: creator.clone(),
        from_chain,
        to_chain,
        from_asset,
        to_asset,
        from_amount,
        to_amount,
        expiry,
        matched: false,
        counterparty: None,
    };

    storage::write_order(env, order_id, &order);
    Ok(order_id)
}

pub fn match_order(env: &Env, counterparty: &Address, order_id: u64) -> Result<u64, Error> {
    if storage::is_paused(env) {
        return Err(Error::Paused);
    }

    let mut order = storage::read_order(env, order_id).ok_or(Error::OrderNotFound)?;

    if order.matched {
        return Err(Error::OrderAlreadyMatched);
    }

    let current_time = env.ledger().timestamp();
    if current_time >= order.expiry {
        return Err(Error::OrderExpired);
    }

    order.matched = true;
    order.counterparty = Some(counterparty.clone());
    storage::write_order(env, order_id, &order);

    // Create cross-chain swap
    let swap_id = storage::increment_swap_counter(env);
    let swap = crate::types::CrossChainSwap {
        id: swap_id,
        stellar_htlc_id: 0,
        other_chain: order.from_chain.clone(),
        other_chain_tx: String::from_slice(env, ""),
        stellar_party: counterparty.clone(),
        other_party: String::from_slice(env, ""),
        state: crate::types::SwapState::Initiated,
        updated_at: current_time,
    };
    storage::write_swap(env, swap_id, &swap);

    Ok(swap_id)
}

pub fn cancel_order(env: &Env, creator: &Address, order_id: u64) -> Result<(), Error> {
    if storage::is_paused(env) {
        return Err(Error::Paused);
    }

    let order = storage::read_order(env, order_id).ok_or(Error::OrderNotFound)?;

    if order.creator != *creator {
        return Err(Error::Unauthorized);
    }

    if order.matched {
        return Err(Error::OrderAlreadyMatched);
    }

    storage::remove_order(env, order_id);
    Ok(())
}
