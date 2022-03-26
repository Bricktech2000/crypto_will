use crate::state::Will;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

//#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
//pub struct InstantiateMsg {
//    pub owner: Addr,
//}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SetWill { will: Will },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetWill {},
}

//#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
//pub struct BenefactorResponse{
//    pub benefactorList: HashMap<Addr, f32>,
//}
