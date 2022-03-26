use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map, Storage};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    wills: Map<Addr, Will>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
struct Will {
    pub benefactors: Vec<Benefactor>,
    pub timestamp: u64,
    pub assets: u128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
struct Benefactor {
    pub benefactorAddr: Addr,
    pub fraction: f64,
}

pub const STATE: Item<State> = Item::new("state");
