import { LCDClient, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { contractAdress } from './address';

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg, fee = new Fee(200000, { uluna: 10000 })) =>
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
          msg
          // { uluna: 200000 }
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

// export const set_recipients = async (wallet, will) =>
//   _exec({ send_recipients: { will } })(wallet);

// export const add_funds = async (wallet, will) =>
//   _exec({ add_funds: { will } })(wallet);

export const set_will = async (wallet, will) =>
  _exec({ set_will: { will } })(wallet);
