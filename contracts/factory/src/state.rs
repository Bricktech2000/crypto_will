use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub willOwners: HashMap<Addr, bool>;
    pub valueInContract: u32;

}

pub const STATE: Item<State> = Item::new("state");
