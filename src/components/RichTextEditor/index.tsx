import {
  FormatAlignCenterIcon,
  FormatAlignJustifyIcon,
  FormatAlignLeftIcon,
  FormatAlignRightIcon,
  FormatBoldIcon,
  FormatClearIcon,
  FormatItalicIcon,
  FormatListBulletedIcon,
  FormatListNumberedIcon,
  HighlightIcon,
  RedoIcon,
  UndoIcon,
} from "@/icons";
import { StrikethroughS } from "@mui/icons-material";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Editor, EditorContent, EditorContentProps } from "@tiptap/react";

type MenuBarProps = {
  editor: Editor | null;
};

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const titleLeveis: Level[] = [1, 2, 3, 4, 5, 6];

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  return (
    <Box
      display="inline-block"
      mb={2}
      gap={1}
      borderBottom="1px solid #ddd"
      position="sticky"
      top={0}
      zIndex={1000}
      sx={({ palette }) => ({ backgroundColor: palette.background.paper })}
      p={0.5}
      width="100%"
    >
      <Tooltip title="Negrito">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Itálico">
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Tachado">
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={editor.isActive("strike") ? "primary" : "default"}
        >
          <StrikethroughS />
        </IconButton>
      </Tooltip>
      <Tooltip title="Marcar texto">
        <IconButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .setMark("highlight", { backgroundColor: "#cccc0e" })
              .run()
          }
          color={editor.isActive("highlight") ? "primary" : "default"}
        >
          <HighlightIcon />
        </IconButton>
      </Tooltip>
      {titleLeveis.map((level) => (
        <Tooltip key={`menu-option-h${level}`} title={`Título H${level}`}>
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            color={
              editor.isActive("heading", { level }) ? "primary" : "default"
            }
          >
            <Typography>H{level}</Typography>
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip title="Alinhar à esquerda">
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          color={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}
        >
          <FormatAlignLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Centralizar">
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          color={
            editor.isActive({ textAlign: "center" }) ? "primary" : "default"
          }
        >
          <FormatAlignCenterIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Alinhar à direita">
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          color={
            editor.isActive({ textAlign: "right" }) ? "primary" : "default"
          }
        >
          <FormatAlignRightIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Justificar">
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          color={
            editor.isActive({ textAlign: "justify" }) ? "primary" : "default"
          }
        >
          <FormatAlignJustifyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Lista não ordenada">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Lista ordenada">
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remover Formatação">
        <IconButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <FormatClearIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Desfazer">
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Avançar">
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

function RichTextEditor({ editor }: EditorContentProps) {
  if (!editor) {
    return null;
  }

  return (
    <Paper variant="outlined">
      {editor.isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </Paper>
  );
}

export default RichTextEditor;
