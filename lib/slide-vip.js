'use strict';
const { provablyFair } = require('./provably-fair');

const RTP = 0.98;

const CLIENT_SEED =
  '000000000000000000033ab71b5fa7edcafe388e5f49719f1de8e1f8d0670460';

const NONCE = 0;

const getFloatPoint = (float) => (1e8 / (float * 1e8)) * RTP;

const compute = (seed) => {
  const float = provablyFair(seed).generateFloat();
  const floatPoint = getFloatPoint(float);
  const crashPoint = Math.floor(floatPoint * 100) / 100;
  const result = Math.max(crashPoint, 1);
  return { float, floatPoint, crashPoint, result };
};

const getResult = (seed) => compute(seed).result;

const getMaxPlayMultiplier = (args) => args.target;

const play = (args, seed) => {
  const { target } = args;
  const number = getResult(seed);
  const payoutMultiplier = target <= number ? target : 0;
  return {
    active: false,
    payoutMultiplier,
    data: { target, number },
  };
};

const slideVip = {
  rtp: RTP,
  slug: 'slide-vip',
  name: 'Slide VIP',
  play,
  compute,
  getResult,
  getMaxPlayMultiplier,
};

module.exports = {
  slideVip,
  RTP,
  CLIENT_SEED,
  NONCE,
  compute,
  getFloatPoint,
  getResult,
  play,
};
