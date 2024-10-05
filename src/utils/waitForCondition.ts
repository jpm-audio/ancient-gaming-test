export default async function waitForCondition(
  condition: () => boolean,
  checkInterval: number = 100
): Promise<void> {
  while (condition()) {
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }
}
