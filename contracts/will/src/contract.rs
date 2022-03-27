#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::Addr;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
use cw20::{Balance, Cw20CoinVerified, Cw20ExecuteMsg, Cw20ReceiveMsg};
use cw_storage_plus::{Item, Map};
use std::collections::HashMap;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Recipient, State, Will, STATE, WILLS};

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
        owner: info.sender.clone(),
        // wills: HashMap::new(),
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    WILLS.save(
        deps.storage,
        info.sender,
        &Will {
            recipients: Vec::new(),
            timestamp: 1648338092814267000,
            assets: 500,
        },
    )?;

    Ok(Response::new().add_attribute("method", "instantiate"))
    // .add_attribute("owner", info.sender))
    // .add_attribute("wills", msg.wills)
    // .add_attribute("recipient", msg.recipients.to_string()));
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::ResetTimestamp {} => try_reset_timestamp(deps, env, info),
        ExecuteMsg::SetRecipients { recipients } => try_set_recipients(deps, env, info, recipients),
        ExecuteMsg::AddFunds { delta_funds } => try_add_funds(deps, env, info, delta_funds),
    }
}

pub fn try_reset_timestamp(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    let block_time = env.block.time.nanos() as u64;

    let current_will = match WILLS.load(deps.storage, info.sender.clone()) {
        Ok(will) => will,
        Err(_) => return Err(ContractError::NonExistentWill {}),
    };

    let will = Will {
        recipients: current_will.recipients,
        timestamp: block_time,
        assets: current_will.assets,
    };

    WILLS.save(deps.storage, info.sender, &will)?;

    Ok(Response::new().add_attribute("method", "try_reset_timestamp"))
}

pub fn try_set_recipients(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    recipients: Vec<Recipient>,
) -> Result<Response, ContractError> {
    let block_time = env.block.time.nanos() as u64;

    // TODO: address valid
    let sum: u64 = 0;
    for recipient in recipients {
        if recipient.ad
        sum += recipient.percentage;
    }
    if sum != 100 {
        return Err(ContractError::InvalidRecipientPercentage {});
    }

    let will = Will {
        recipients: recipients,
        timestamp: block_time,
        assets: 0i64,
    };

    WILLS.save(deps.storage, info.sender, &will)?;

    Ok(Response::new().add_attribute("method", "try_set_recipients"))
}

pub fn try_add_funds(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    delta_funds: i64,
) -> Result<Response, ContractError> {
    let current_will = WILLS
        .may_load(deps.storage, info.sender.clone())
        .unwrap()
        .unwrap();

    let block_time = env.block.time.nanos() as u64;

    let will = Will {
        recipients: current_will.recipients,
        timestamp: block_time,
        assets: current_will.assets + delta_funds,
    };

    WILLS.save(deps.storage, info.sender, &will)?;

    Ok(Response::new().add_attribute("method", "try_add_funds"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetWill { addr } => to_binary(&try_get_will(deps, env, addr)?),
    }
}

pub fn try_get_will(deps: Deps, env: Env, addr: Addr) -> StdResult<Will> {
    let current_will = WILLS.may_load(deps.storage, addr).unwrap().unwrap();

    // if !state.wills.contains_key(&will.recipient) {
    //     return Err(ContractError::InvalidAddress);
    // }

    // Ok(Will {
    //     will: wills.asdf(info.sender),
    // })

    Ok(current_will)
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies(&[]);

        let msg = instantiate { count: 17 };
        let info = mock_info("creator", &coins(1000, "earth"));

        // we can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
        let value: CountResponse = from_binary(&res).unwrap();
        assert_eq!(17, value.count);
    }

    #[test]
    fn increment() {
        let mut deps = mock_dependencies(&coins(2, "token"));

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // beneficiary can release it
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SetWill { Will };
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // should increase counter by 1
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
        let value: CountResponse = from_binary(&res).unwrap();
        assert_eq!(18, value.count);
    }

    #[test]
    fn reset() {
        let mut deps = mock_dependencies(&coins(2, "token"));

        let msg = InstantiateMsg { count: 17 };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // beneficiary can release it
        let unauth_info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::Reset { count: 5 };
        let res = execute(deps.as_mut(), mock_env(), unauth_info, msg);
        match res {
            Err(ContractError::Unauthorized {}) => {}
            _ => panic!("Must return unauthorized error"),
        }

        // only the original creator can reset the counter
        let auth_info = mock_info("creator", &coins(2, "token"));
        let msg = ExecuteMsg::Reset { count: 5 };
        let _res = execute(deps.as_mut(), mock_env(), auth_info, msg).unwrap();

        // should now be 5
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
        let value: CountResponse = from_binary(&res).unwrap();
        assert_eq!(5, value.count);
    }
}

// use std::process;
//
// pub fn removeWill(
//     deps: DepsMut,
//     env: Env,
//     info: MessageInfo,
//     recipient: Addr,
// ) -> Result<Response, ContractError> {
//     let mut state = WILLS.load(deps.storage)?;

//     if !state.wills.contains_key(&will.recipient) {
//         //TODO:
//         process::exit(1);
//     }
//     //RETURN MONEY TO USER
//     state.remove(&recipient);
// }

//Balance::from(info.funds)
