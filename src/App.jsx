import React, { useState, useEffect } from "react";

export default function App() {
  const [terassi, setTerassi] = useState("");
  const [datetime, setDatetime] = useState("");
  const [participant, setParticipant] = useState("");
  const [ratings, setRatings] = useState({ food: 3, drinks: 3, milieu: 3, vibe: 3 });
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("terdeData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("terdeData", JSON.stringify(list));
  }, [list]);

  const getAvg = (r) => ((r.food + r.drinks + r.milieu + r.vibe) / 4).toFixed(1);

  const addTerassi = () => {
    if (!terassi.trim() || !datetime.trim()) return;
    setList([...list, { name: terassi, datetime, ratings, participants: [] }]);
    setTerassi("");
    setDatetime("");
    setRatings({ food: 3, drinks: 3, milieu: 3, vibe: 3 });
  };

  const joinTerassi = (index) => {
    if (!participant.trim()) return;
    const updated = [...list];
    const names = updated[index].participants;
    if (!names.includes(participant)) {
      names.push(participant);
      setList(updated);
    }
  };

  const getPoints = () => {
    const points = {};
    list.forEach(t =>
      t.participants.forEach(p => {
        points[p] = (points[p] || 0) + 1;
      })
    );
    return points;
  };

  const getTitle = (points) => {
    if (points >= 5) return "🌞 Auringonmetsästäjä";
    if (points >= 3) return "🍹 Juomamestari";
    if (points >= 1) return "🐣 Terassikokelas";
    return "👀 Tarkkailija";
  };

  const points = getPoints();
  const sorted = [...list].sort((a, b) => getAvg(b.ratings) - getAvg(a.ratings));

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '1rem' }}>
      <h1>🍓 Tytsyjen Terde App</h1>
      <input
        placeholder="Terassin nimi"
        value={terassi}
        onChange={(e) => setTerassi(e.target.value)}
        style={{ width: '100%', padding: '0.5rem' }}
      />
      <input
        placeholder="Ajankohta (esim. Pe klo 17)"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      {["food", "drinks", "milieu", "vibe"].map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={ratings[key]}
            onChange={(e) => setRatings({ ...ratings, [key]: Number(e.target.value) })}
          />
          <span>{ratings[key]}</span>
        </div>
      ))}
      <button onClick={addTerassi} style={{ margin: '1rem 0' }}>Lisää terassi</button>

      <input
        placeholder="Sun nimi"
        value={participant}
        onChange={(e) => setParticipant(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <h2>🏆 Top Terassit</h2>
      <ul>
        {sorted.map((t, i) => (
          <li key={i} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{t.name} ({t.datetime})</h3>
            <p>Keskiarvo: {getAvg(t.ratings)}</p>
            <p>🍽️ {t.ratings.food} | 🍹 {t.ratings.drinks} | 🌇 {t.ratings.milieu} | 🎉 {t.ratings.vibe}</p>
            <button onClick={() => joinTerassi(i)}>Oon tulossa!</button>
            <p>👥 Osallistujat: {t.participants.join(', ') || 'Ei vielä ketään'}</p>
          </li>
        ))}
      </ul>

      <h2>🌟 Tytsyjen Ranking</h2>
      <ul>
        {Object.entries(points).map(([name, pts]) => (
          <li key={name}>{name}: {pts} pistettä – {getTitle(pts)}</li>
        ))}
      </ul>
    </div>
  );
}