import store from "store";
import MergeApiObjects from "../Helpers/MergeApiObjects";
import { storeEncryptString } from "../Helpers/CryptoWorkerWrapper";

import { STORED_MASTER_CARD_ACTIONS } from "../Actions/master_card_actions";

export const defaultState = {
    master_card_actions: [],
    account_id: false,
    loading: false,
    newer_ids: [],
    older_ids: []
};

export default (state = defaultState, action) => {
    let master_card_actions = [...state.master_card_actions];

    switch (action.type) {
        case "MASTER_CARD_ACTIONS_UPDATE_INFO":
        case "MASTER_CARD_ACTIONS_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            // const ignoreOldItems =
            //     action.type === "MASTER_CARD_ACTIONS_SET_INFO" ||
            //     state.account_id !== action.payload.account_id;
            const ignoreOldItems = false;

            const mergedInfo = MergeApiObjects(
                action.payload.account_id,
                action.payload.masterCardActions,
                ignoreOldItems ? [] : master_card_actions
            );

            // limit payments to 1000 in total
            const mergedMasterCardActions = mergedInfo.items.slice(0, 1000);

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    {
                        items: mergedMasterCardActions,
                        account_id: action.payload.account_id
                    },
                    STORED_MASTER_CARD_ACTIONS,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
            }

            // update newer and older id for this monetary account
            const newerIds = {
                ...state.newer_ids,
                [action.payload.account_id]: mergedInfo.newer_id
            };
            const olderIds = {
                ...state.older_ids,
                [action.payload.account_id]: mergedInfo.older_id
            };

            return {
                ...state,
                master_card_actions: mergedInfo.items,
                account_id: action.payload.account_id,
                newer_ids: newerIds,
                older_ids: olderIds
            };

        case "MASTER_CARD_ACTIONS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "MASTER_CARD_ACTIONS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "MASTER_CARD_ACTIONS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(STORED_MASTER_CARD_ACTIONS);
            return {
                master_card_actions: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
