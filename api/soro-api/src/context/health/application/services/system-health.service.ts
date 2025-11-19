import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class SystemHealthService {
  /**
   * Obtener información de CPU
   */
  getCPUInfo() {
    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'Unknown';
    const cores = cpus.length;

    // Calcular uso promedio de CPU
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~((100 * idle) / total);

    return {
      usage: Math.round(usage * 100) / 100,
      cores,
      model: cpuModel,
    };
  }

  /**
   * Obtener información de memoria
   */
  getMemoryInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usage = (usedMemory / totalMemory) * 100;

    return {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory,
      usage: Math.round(usage * 100) / 100,
    };
  }

  /**
   * Obtener información de disco (simulado - requiere librería externa para datos reales)
   */
  getDiskInfo() {
    // En producción, usar una librería como 'diskusage' o 'check-disk-space'
    // Por ahora retornamos valores simulados
    return {
      total: 500 * 1024 * 1024 * 1024, // 500 GB
      used: 250 * 1024 * 1024 * 1024, // 250 GB
      free: 250 * 1024 * 1024 * 1024, // 250 GB
      usage: 50,
    };
  }

  /**
   * Obtener toda la información del sistema
   */
  getSystemHealth() {
    return {
      cpu: this.getCPUInfo(),
      memory: this.getMemoryInfo(),
      disk: this.getDiskInfo(),
    };
  }
}
