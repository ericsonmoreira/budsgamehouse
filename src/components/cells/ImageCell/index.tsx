import { Tooltip } from "@mui/material";

type ImageCellProps = {
  value: string;
};

function ImageCell({ value }: ImageCellProps) {
  return (
    <Tooltip
      arrow
      placement="right"
      PopperProps={{ sx: { backgroundColor: "none" } }}
      title={<img src={value} style={{ height: 300, marginTop: 5 }} />}
    >
      <img src={value} style={{ height: "2rem" }} />
    </Tooltip>
  );
}

export default ImageCell;
