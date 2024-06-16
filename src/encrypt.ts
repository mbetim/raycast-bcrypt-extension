import { Clipboard, LaunchProps, showHUD } from "@raycast/api";
import { ZodError, z } from "zod";
import bcrypt from "bcryptjs";

const argumentsSchema = z.object({
  str: z.string().min(1),
  salt: z.coerce
    .number()
    .transform((arg) => (arg <= 0 ? 12 : arg))
    .default(12),
});

export default async function main(props: LaunchProps<{ arguments: { str: string; salt?: string } }>) {
  try {
    const values = argumentsSchema.parse(props.arguments);
    const hash = bcrypt.hashSync(values.str, values.salt);

    await Clipboard.copy(hash);
    await showHUD("✅ Hash copied to the clipboard");
  } catch (err) {
    let errorMessage = err instanceof Error ? err.message : "An unexpected error happened";
    console.error(err);
    if (err instanceof ZodError) {
      const [zodErrorMessage] = err.format()._errors;
      errorMessage = zodErrorMessage;
    }

    await showHUD(`🚨 ${errorMessage}`);
  }
}
