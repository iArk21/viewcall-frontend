const participants = ["Ana", "Pedro", "Luis"];

export default function ParticipantsPanel() {
  return (
    <div className="bg-[#20242E] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Participantes</h2>

      <div className="flex flex-col gap-3">
        {participants.map((name) => (
          <div key={name} className="flex items-center gap-3 bg-[#161A21] p-3 rounded-lg">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              {name[0]}
            </div>
            <p className="text-sm">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
