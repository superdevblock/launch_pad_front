import { toast } from 'react-toastify';
import {Client} from '@snapshot-labs/snapshot.js';
import { getSnapshotUrl } from '../../../hooks/network';

function errorNotification(description) {
    toast.error("Oops, something went wrong")
  }

export async function send(spaceId, type, payload, web3Provider, account, chainId) {
    try {
      return await sendEIP712(spaceId, type, payload, web3Provider, account, chainId);
    } catch (e) {
      errorNotification(e?.error_description || '');
      return e;
    } finally {
    }
}

async function sendEIP712(spaceId, type, payload, web3Provider, account, chainId) {
    // const client = isGnosisSafe.value ? clientGnosisSafe : clientEIP712;
    const DEFINED_APP = "ElevatePAD"
    const client = new Client(getSnapshotUrl(chainId));
    if (type === 'proposal') {
      let plugins = {};
      if (Object.keys(payload.metadata?.plugins).length !== 0)
        plugins = payload.metadata.plugins;
        console.log("sniper: getSnapshotUrl: ", getSnapshotUrl(chainId), spaceId, plugins)
      return client.proposal(web3Provider, account, {
        space: spaceId,
        type: payload.type,
        title: payload.name,
        body: payload.body,
        discussion: payload.discussion,
        choices: payload.choices,
        start: payload.start,
        end: payload.end,
        snapshot: payload.snapshot,
        plugins: JSON.stringify(plugins),
        app: DEFINED_APP
      });
    } else if (type === 'vote') {
      return client.vote(web3Provider, account, {
        space: spaceId,
        proposal: payload.proposal.id,
        type: payload.proposal.type,
        choice: payload.choice,
        privacy: payload.privacy,
        app: DEFINED_APP,
        reason: payload.reason
      });
    } else if (type === 'delete-proposal') {
      return client.cancelProposal(web3Provider, account, {
        space: spaceId,
        proposal: payload.proposal.id
      });
    } else if (type === 'settings') {
      return client.space(web3Provider, account, {
        space: spaceId,
        settings: JSON.stringify(payload)
      });
    }
  }