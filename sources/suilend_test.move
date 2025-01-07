module suilend_test::suilend_subvault;

use suilend::lending_market::{ObligationOwnerCap};

public struct SuilendVault<phantom Market, phantom CoinType, phantom GrowCoin> has key, store {
    id: UID,
    reserve_array_index: u64,
    obligation_owner_cap: ObligationOwnerCap<Market>,
    deposits_open: bool,
}