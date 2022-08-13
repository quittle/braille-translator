import "./braille-box.scss";
import { ReactComponent as CopyIcon } from "./assets/icon-copy.svg";
import { useEffect, useState } from "react";
import { usePrevious } from "./effects";
import "./copy-button.scss";

/**
 * Copies text to the user's clipboard.
 */
export default function CopyButton(props: Readonly<{ textToCopy: string }>) {
  const [recentlyCopied, setRecentlyCopied] = useState<boolean>(false);
  const [copyButtonTimeout, setCopyButtonTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const previousTextToCopy = usePrevious(props.textToCopy);

  useEffect(() => {
    if (previousTextToCopy != props.textToCopy) {
      clearTimeout(copyButtonTimeout);
      setRecentlyCopied(false);
      setCopyButtonTimeout(undefined);
    }
  }, [previousTextToCopy, props.textToCopy]);

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(props.textToCopy);
    setRecentlyCopied(true);
    clearTimeout(copyButtonTimeout);
    setCopyButtonTimeout(
      setTimeout(() => {
        setRecentlyCopied(false);
      }, 3000)
    );
  };

  return (
    <button
      className="copy-button"
      onClick={onCopyButtonClick}
      disabled={recentlyCopied}
    >
      <CopyIcon />
      {recentlyCopied ? "Copied to clipboard!" : "Copy"}
    </button>
  );
}

/** Determines if the copy button will work. */
CopyButton.isSupported = (): boolean => {
  return !!navigator.clipboard;
};
