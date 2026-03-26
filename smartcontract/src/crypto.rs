/// Cryptographic utilities for HTLC secret verification.
///
/// Security notes:
/// - `constant_time_eq` prevents timing-based side channel attacks by
///   comparing all 32 bytes unconditionally, never short-circuiting.
/// - `generate_secret` uses the Soroban PRNG which is seeded by the
///   ledger, making secrets unpredictable to external observers.
use crate::types::HashAlgorithm;
use soroban_sdk::{Bytes, BytesN, Env};

/// Compute the hash of `data` using `algorithm`.
/// Returns a 32-byte hash digest.
pub fn compute_hash(env: &Env, data: &Bytes, algorithm: &HashAlgorithm) -> BytesN<32> {
    match algorithm {
        HashAlgorithm::SHA256 => env.crypto().sha256(data).into(),
        HashAlgorithm::Keccak256 => env.crypto().keccak256(data).into(),
    }
}

/// Compare two 32-byte values in constant time to prevent timing attacks.
///
/// This function always examines all 32 bytes before returning, so its
/// execution time does not reveal how many bytes match. Use this instead
/// of `==` when comparing secrets or hash digests.
pub fn constant_time_eq(a: &BytesN<32>, b: &BytesN<32>) -> bool {
    let a_arr = a.to_array();
    let b_arr = b.to_array();
    let mut diff: u8 = 0;
    for i in 0..32 {
        diff |= a_arr[i] ^ b_arr[i];
    }
    diff == 0
}

/// Generate a cryptographically random 32-byte secret using the Soroban PRNG.
///
/// The PRNG is seeded from ledger data and is safe to use for generating
/// one-time HTLC secrets.
pub fn generate_secret(env: &Env) -> BytesN<32> {
    env.prng().gen::<BytesN<32>>()
}

/// Validate that a secret preimage hashes to the expected hash lock.
///
/// Uses constant-time comparison to prevent timing attacks.
pub fn verify_preimage(
    env: &Env,
    secret: &Bytes,
    hash_lock: &BytesN<32>,
    algorithm: &HashAlgorithm,
) -> bool {
    let computed = compute_hash(env, secret, algorithm);
    constant_time_eq(&computed, hash_lock)
}
