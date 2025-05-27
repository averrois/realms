import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LinkClient from "./LinkClient";

export default async function LinkRealm({
  searchParams,
}: {
  searchParams: Promise<{ id: string; name: string }>;
}) {
  const { id, name } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signin");
  }

  const { data: ownedRealms, error } = await supabase
    .from("realms")
    .select("id, name")
    .eq("owner_id", user.id);

  return (
    <LinkClient serverId={id} serverName={name} ownedRealms={ownedRealms} />
  );
}
