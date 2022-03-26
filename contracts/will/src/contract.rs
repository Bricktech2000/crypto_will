#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Benefactor, Will, State, STATE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:will";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        owner: info.sender(),
        wills: Map::new(deps.storage),
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("wallets", msg.benefactors);
        .add_attribute("benefactors", msg.benefactors.to_string());
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::SetWill { will: Will } => try_set_will(deps, info, will),
    }
}

pub fn try_set_will(deps: DepsMut, info: MessageInfo, will: Will) -> Result<Response, ContractError> {
    let mut state = STATE.load(deps.storage)?;

    if !state.wills.contains_key(&will.benefactor) {
        //
    }

    let sender = info.sender()
        .ok_or(ContractError::NoSender)?
        .verify_signature(&will.signature)
        .map_err(|_| ContractError::InvalidSignature)?;

    let block_time = env.block.time.ok_or(ContractError::NoTime)?;

    let will = Will {
        benefactors: Map::new(deps.storage),
        timestamp: block_time,
        assets: 0u128,
    };

    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        state.wills.insert(sender, will);
        Ok(state)
    })?;

    Ok(Response::new().add_attribute("method", "try_set_will"))
}
