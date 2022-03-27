#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::Uint128;
use cosmwasm_std::{
    from_binary, to_binary, Addr, BankMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env,
    MessageInfo, Response, StdResult, WasmMsg,
};
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
            assets: 500000000,
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
        ExecuteMsg::SetAssets { assets } => try_set_assets(deps, env, info, assets),
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
    let current_will = WILLS
        .may_load(deps.storage, info.sender.clone())
        .unwrap()
        .unwrap();

    let block_time = env.block.time.nanos() as u64;

    // TODO: address valid
    let mut sum: u64 = 0;
    for recipient in &recipients {
        sum += recipient.percentage;
    }
    if sum != 100 {
        return Err(ContractError::InvalidRecipientPercentage {});
    }

    let will = Will {
        recipients: recipients,
        timestamp: block_time,
        assets: current_will.assets,
    };

    WILLS.save(deps.storage, info.sender, &will)?;

    Ok(Response::new().add_attribute("method", "try_set_recipients"))
}

pub fn try_remove_will(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    recipients: Vec<Recipient>,
) -> Result<Response, ContractError> {
    let current_will = match WILLS.load(deps.storage, info.sender.clone()) {
        Ok(will) => will,
        Err(_) => return Err(ContractError::NonExistentWill {}),
    };

    WILLS.remove(deps.storage, info.sender);

    Ok(Response::new().add_attribute("method", "try_set_recipients"))
}

pub fn try_set_assets(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    assets: u64,
) -> Result<Response, ContractError> {
    let current_will = WILLS
        .may_load(deps.storage, info.sender.clone())
        .unwrap()
        .unwrap();

    let block_time = env.block.time.nanos() as u64;

    let delta_assets = assets as i64 - current_will.assets as i64;

    let mut msgs: Vec<CosmosMsg> = Vec::new();

    if delta_assets == 0 {
        Ok(Response::new().add_attribute("method", "try_set_assets"))
    } else if delta_assets > 0 {
        //transfer funds to user
        // let index = info.funds.iter().enumerate().find_map(|(i, exist)| {
        //     if exist.denom == "uluna" {
        //         Some(i)
        //     } else {
        //         None
        //     }
        // });

        // match index {
        //     Some(idx) => {
        //         if info.funds[idx].amount < fee.amount {
        //             return Err(StdError::generic_err("Incefficiant fee to cover costs"));
        //         }
        //         let from_address = env.contract.address.clone();
        //         messages.push(CosmosMsg::Bank(BankMsg::Send {
        //             from_address,
        //             to_address: info.sender.clone(),
        //             // deps.api.human_address(&owner)?,
        //             amount: vec![fee],
        //         }));
        //     }
        //     None => {
        //         return Err(StdError::generic_err(
        //             "You must pay a fee with the specified token",
        //         ));
        //     }
        // }

        // index.map(|i| {
        //     let coin = env.message.sent_funds[i].clone();
        //     msgs.push(BankMsg::Send {
        //         from_address: info.sender.clone(),
        //         to_address: info.sender.clone(),
        //         amount: coin,
        //     });
        // });

        // info.coins.iter().for_each(|coin| {
        //     let msg = BankMsg::Send {
        //         from_address: info.sender.clone(),
        //         to_address: info.sender.clone(),
        //         amount: Coin {
        //             denom: coin.denom.clone(),
        //             amount: Uint128::from(delta_assets),
        //         },
        //     };
        //     msgs.push(msg.into());
        // });
        // let msg = Cw20ExecuteMsg::Transfer {
        //     // recipient: env.contract.address.clone().into(),
        //     amount: (delta_assets as u128).into(),
        //     // owner: info.sender.clone().into(),
        //     recipient: info.sender.clone().into(),
        // };

        // let exec = SubMsg::new(WasmMsg::Execute {
        //     contract_addr: env.contract.address.into(),
        //     msg: to_binary(&msg)?,
        //     funds: vec![],
        // });
        let will = Will {
            recipients: current_will.recipients,
            timestamp: block_time,
            assets: assets,
        };

        WILLS.save(deps.storage, info.sender, &will)?;

        Ok(Response::new().add_attribute("method", "try_set_assets"))
    } else if delta_assets < 0 {
        // let from_address = env.contract.address.clone();

        msgs.push(CosmosMsg::Bank(BankMsg::Send {
            to_address: info.sender.clone().into(),
            amount: vec![Coin {
                denom: "uluna".to_string(),
                amount: (-delta_assets as u128).into(),
            }],
        }));

        let will = Will {
            recipients: current_will.recipients,
            timestamp: block_time,
            assets: assets,
        };

        WILLS.save(deps.storage, info.sender, &will)?;

        Ok(Response::new()
            .add_attribute("method", "try_set_assets")
            .add_message(msgs[0].clone()))
    } else {
        Ok(Response::new().add_attribute("method", "try_set_assets"))
    }

    // no change
    // return Ok(Response::new().add_attribute("method", "try_set_assets"));
    // } else if delta_assets < 0 {
    // c: Cw20CoinVerified

    //  {
    //     recipient: to.into(),
    //     amount: c.amount,
    // };

    //asset handling ONLY
    //transfer delta to them
    // } else {

    // put delate in
    // }
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
