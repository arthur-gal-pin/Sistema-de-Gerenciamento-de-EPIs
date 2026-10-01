export default function PersonCard({ person }) {
  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h5>{person.name}</h5>
      <p>Email: {person.email}</p>
      <p>Telefone: {person.phone}</p>
    </div>
  );
}