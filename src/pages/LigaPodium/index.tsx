import Page from "@/components/Page";

function LigaPodium() {
  return (
    <Page>
      {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
      {/* biome-ignore lint/a11y/useIframeTitle: <explanation> */}
      <iframe
        height="100%"
        width="100%"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRtBctJ67dOeMus6sysL6k-S8i5usYgLXGW_dhY2LrOpKb0D-UeKCUdZ4JmAnif27LinMxzDcBwAi9U/pubhtml"
      ></iframe>
    </Page>
  );
}

export default LigaPodium;
