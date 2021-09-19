export class CommonUtil {
  static async sleep(waitSeconds: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, Math.floor((waitSeconds + Math.random()) * 1000))
    })
  }
}