import ThreeDotLoader from "@/components/three-dot-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
};

export default function Backdrop({ open }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent className="no-focus! border-none bg-transparent shadow-none focus:ring-0! focus:outline-0! focus-visible:ring-0! focus-visible:outline-0! [&_button]:hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p className="text-foreground text-sm italic">Processing Action</p>
          <ThreeDotLoader size="md" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
