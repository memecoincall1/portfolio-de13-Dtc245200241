const queries = [
  { id: "nha-gia-kim", q: "intitle:Nhà giả kim inauthor:Coelho" },
  { id: "nha-gia-kim-en", q: "intitle:The Alchemist inauthor:Paulo Coelho" },
  { id: "cha-giau", q: "intitle:Cha giàu cha nghèo inauthor:Kiyosaki" },
  { id: "rich-dad", q: "intitle:Rich Dad Poor Dad inauthor:Kiyosaki" },
  { id: "tien-dau", q: "intitle:Tiền đấu với vàng" },
  { id: "ban-khong", q: "intitle:Bán khống inauthor:Lewis" },
  { id: "big-short", q: "intitle:The Big Short inauthor:Michael Lewis" },
  { id: "thep", q: "intitle:Thép đã tôi thế đấy" },
  { id: "steel", q: "intitle:How the Steel Was Tempered Ostrovsky" },
  { id: "dbp", q: "intitle:Điện Biên Phủ Điểm hẹn lịch sử" },
  { id: "tu-duy-nguoc", q: "intitle:Tư Duy Ngược inauthor:Nguyễn Anh Dũng" },
  { id: "wall", q: "intitle:Trên đỉnh phố Wall inauthor:Lynch" },
  { id: "one-up", q: "intitle:One Up On Wall Street inauthor:Lynch" },
  { id: "nhan-gian", q: "intitle:Nhân gian đáng giá" },
  { id: "tu-duy-mo", q: "intitle:Tư Duy Mở inauthor:Nguyễn Anh Dũng" },
];

for (const item of queries) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(item.q)}&maxResults=3`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("\n====", item.id);
  for (const vol of data.items || []) {
    const info = vol.volumeInfo || {};
    console.log({
      title: info.title,
      authors: info.authors,
      lang: info.language,
      isbn: info.industryIdentifiers,
      thumb: info.imageLinks?.thumbnail,
      small: info.imageLinks?.smallThumbnail,
      infoLink: info.infoLink,
    });
  }
}
