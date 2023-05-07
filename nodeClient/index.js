const os = require('os');

const cpuAverage = () => {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach(aCore => {
    for (mode in aCore.times) {
      totalMs += aCore.times[mode];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  }
}

const getCpuLoad = () => new Promise((resolve, reject) => {
  const start = cpuAverage()
  setTimeout(() => {
    const end = cpuAverage();
    const idleDiff = end.idle - start.idle;
    const totalDiff = end.total - start.total;

    const percentOfCpu = 100 - Math.floor(100 * idleDiff / totalDiff);

    resolve(percentOfCpu);
  }, 100);
})

const performanceLoadData = () => new Promise(async (resolve, reject) => {
  const cpus = os.cpus()
  const osType = os.type() === 'Darwin' ? 'Mac' : os.type();
  const upTime = os.uptime();

  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const memUseage = Math.floor(usedMem / totalMem * 100) / 100;

  const cpuType = cpus[0].model;
  const numCores = cpus.length;
  const cpuSpeed = cpus[0].speed;

  const cpuLoad = await getCpuLoad();
  resolve({
    freeMem, totalMem, usedMem, memUseage, osType, upTime, cpuType, numCores, cpuSpeed, cpuLoad
  })
})

// const run = async() =>{
//   const data = await performanceLoadData();
//   console.log(data);
// }
// run();