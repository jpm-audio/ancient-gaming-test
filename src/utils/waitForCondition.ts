export default async function waitForCondition(
  condition: () => boolean,
  checkInterval: number = 100
): Promise<void> {
  // Keep checking until the condition is false
  while (condition()) {
    // Pause for a specified interval before re-checking the condition
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }
}
