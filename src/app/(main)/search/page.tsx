import { Suspense } from "react";
import SearchPage from "@/screens/SearchPage";

export default function SearchPageRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
