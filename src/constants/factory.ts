import { Hex } from "viem"

const FACTORY_ADDRESS = "0x940F6aFF8F3C42330686aaf307D3fe20b00FCB7D" as Hex
const FACTORY_ABI = [
  {
    type: "function",
    name: "createAccount",
    inputs: [
      { name: "publicKey", type: "bytes32[2]", internalType: "bytes32[2]" },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [
      { name: "ret", type: "address", internalType: "contract Account" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAddress",
    inputs: [
      { name: "publicKey", type: "bytes32[2]", internalType: "bytes32[2]" },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
] as const

const ROUTER_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "teleporterRegistry",
        type: "address",
        internalType: "address",
      },
      {
        name: "minTeleporterVersion",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "feeCollector",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMinTeleporterVersion",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isTeleporterAddressPaused",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pauseTeleporterAddress",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "receiveTeleporterMessage",
    inputs: [
      {
        name: "sourceBlockchainID",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "originSenderAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "message",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "start",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "instructions",
        type: "tuple",
        internalType: "struct Instructions",
        components: [
          {
            name: "receiver",
            type: "address",
            internalType: "address",
          },
          {
            name: "hops",
            type: "tuple[]",
            internalType: "struct Hop[]",
            components: [
              {
                name: "action",
                type: "uint8",
                internalType: "enum Action",
              },
              {
                name: "requiredGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "recipientGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "trade",
                type: "bytes",
                internalType: "bytes",
              },
              {
                name: "bridgePath",
                type: "tuple",
                internalType: "struct BridgePath",
                components: [
                  {
                    name: "bridgeSourceChain",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "sourceBridgeIsNative",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "bridgeDestinationChain",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "cellDestinationChain",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "destinationBlockchainID",
                    type: "bytes32",
                    internalType: "bytes32",
                  },
                  {
                    name: "teleporterFee",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "secondaryTeleporterFee",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "teleporterRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract TeleporterRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpauseTeleporterAddress",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMinTeleporterVersion",
    inputs: [
      {
        name: "version",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "MinTeleporterVersionUpdated",
    inputs: [
      {
        name: "oldMinTeleporterVersion",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newMinTeleporterVersion",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TeleporterAddressPaused",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TeleporterAddressUnpaused",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidArgument",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInstructions",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
]
const ROUTER_ADDRESS = "0x681Bf6Fbc98C779b534925426929BD7cAe87C054" as Hex

const tokenHomesAddress: Record<Hex, Hex> = {
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7": "" as Hex,
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E":
    "0x698044F6CC7186D1e2dbEF130d20Dc6dfbA9ecC5" as Hex,
}

const tokenRemotesAddress: Record<Hex, Hex> = {
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7": "" as Hex,
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E":
    "0x1BB241dF1B33a9A5CABB63d81Ef0485c17aa0EB3" as Hex,
}

export {
  FACTORY_ABI,
  FACTORY_ADDRESS,
  ROUTER_ABI,
  ROUTER_ADDRESS,
  tokenHomesAddress,
  tokenRemotesAddress,
}
