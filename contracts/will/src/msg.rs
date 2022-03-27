use crate::state::{Recipient, State, Will, STATE, WILLS};
use cosmwasm_std::Addr;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    DistributeAssets { owner: Addr },
    ResetTimestamp {},
    SetRecipients { recipients: Vec<Recipient> },
    SetAssets { assets: u64 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetWill { addr: Addr },
}

//#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
//pub struct recipientResponse{
//    pub recipientList: HashMap<Addr, f32>,
//}
