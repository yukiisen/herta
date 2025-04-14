export interface TermInput {
    command: string,
    stdout: string[]
}

export const Term = ({ command, stdout }: TermInput) => {
  return (
    <aside className="bg-black text-white p-4 m-1 rounded-lg w-fit min-w-xs font-mono">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 text-red-500">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
        <p className="text-sm">bash</p>
      </div>
      <div className="mt-4">
        <p className="text-secondary">$ { command }</p>
          { stdout.map((e, i) => <p key={ i } className="text-white">{e}</p>) }
      </div>
    </aside>
  );
}
