
export async function getHangman() {
    return $fetch<string>(
        `https://localhost:7109/getHangman`
      );
}