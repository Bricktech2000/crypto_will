import { LCDClient, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { contractAdress } from './address';

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg, funds = 0, fee = new Fee(200000, { uluna: 10000 })) =>
  async (wallet) => {
    const lcd = new LCDClient({
      URL: wallet.network.lcd,
      chainID: wallet.network.chainID,
    });

    const { result } = await wallet.post({
      fee,
      msgs: [
        new MsgExecuteContract(
          wallet.walletAddress,
          contractAdress(wallet),
          msg,
          funds ? { uluna: funds } : {}
        ),
      ],
    });

    while (true) {
      try {
        return await lcd.tx.txInfo(result.txhash);
      } catch (e) {
        if (Date.now() < untilInterval) {
          await sleep(500);
        } else if (Date.now() < until) {
          await sleep(1000 * 10);
        } else {
          throw new Error(
            `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
          );
        }
      }
    }
  };

// ==== execute contract ====

export const set_recipients = async (wallet, recipients) =>
  _exec({ set_recipients: { recipients } })(wallet);

export const set_assets = async (wallet, assets, funds) =>
  _exec({ set_assets: { assets: assets * 1000000 } }, funds * 1000000)(wallet);

export const reset_timestamp = async (wallet) =>
  _exec({ reset_timestamp: {} })(wallet);

export const distribute_assets = async (wallet, owner) =>
  _exec({ distribute_assets: { owner } })(wallet);
