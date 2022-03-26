use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use cosmwasm_std::Addr;
use cosmwasm_std::Timestamp;
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub owner: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Will {
    pub recipients: Vec<Recipient>,
    pub timestamp: u64,
    pub assets: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Recipient {
    pub address: Addr,
    pub percentage: u64,
}

pub const WILLS: Map<Addr, Will> = Map::new("wills");
pub const STATE: Item<State> = Item::new("state");
