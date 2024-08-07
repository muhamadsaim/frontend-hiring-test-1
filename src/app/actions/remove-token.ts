'use server'
import { cookies } from "next/headers";

export default  async function removeToken() {
  const cookieStore = cookies();
  return cookieStore.delete("token");
}


