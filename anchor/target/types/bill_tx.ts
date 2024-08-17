/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bill_tx.json`.
 */
export type BillTx = {
  "address": "HRqUrh12DaapFSP1sT7ezuTsFNfVqDqKfTCd6mmBsYqN",
  "metadata": {
    "name": "billTx",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createBill",
      "discriminator": [
        28,
        241,
        180,
        161,
        109,
        255,
        220,
        44
      ],
      "accounts": [
        {
          "name": "bill",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "billRefId"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "billRefId",
          "type": "string"
        },
        {
          "name": "totalAmount",
          "type": "string"
        },
        {
          "name": "items",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "isPaymentDone",
          "type": "bool"
        }
      ]
    },
    {
      "name": "deleteBill",
      "discriminator": [
        248,
        3,
        9,
        2,
        60,
        121,
        177,
        132
      ],
      "accounts": [
        {
          "name": "bill",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "billRefId"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "billRefId",
          "type": "string"
        },
        {
          "name": "totalAmount",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateBill",
      "discriminator": [
        130,
        253,
        154,
        215,
        162,
        144,
        146,
        168
      ],
      "accounts": [
        {
          "name": "bill",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "billRefId"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "billRefId",
          "type": "string"
        },
        {
          "name": "totalAmount",
          "type": "string"
        },
        {
          "name": "items",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "isPaymentDone",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "billingState",
      "discriminator": [
        194,
        150,
        12,
        133,
        6,
        55,
        116,
        23
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "listOfItemsTooLong",
      "msg": "Too many Items"
    },
    {
      "code": 6001,
      "name": "totalAmountTooLong",
      "msg": "Amount Of Bill Too long"
    }
  ],
  "types": [
    {
      "name": "billingState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "billRefId",
            "type": "string"
          },
          {
            "name": "totalAmount",
            "type": "string"
          },
          {
            "name": "items",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "isPaymentDone",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
