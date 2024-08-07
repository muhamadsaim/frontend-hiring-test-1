'use server'
import { cookies } from "next/headers";

export default  async function getToken() {
  const cookieStore = cookies();
  return cookieStore.get("token");
}


