import Page from "@/components/Page";

function LigaPodium() {
  return (
    <Page>
      {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
      {/* biome-ignore lint/a11y/useIframeTitle: <explanation> */}
      <iframe
        height="100%"
        width="100%"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSlRJ3xaVqcUE_NfDB-gnijQ1mTxajyP0y8vdWTOwjUKdYHcELrKUf3Upjoktl9AqmHwRrXDMbPjF39/pubhtml?gid=1569588811&single=true"
      ></iframe>
    </Page>
  );
}

export default LigaPodium;
