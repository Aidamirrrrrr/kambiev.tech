import { describe, expect, it } from "vitest";
import { htmlToText } from "./email";

describe("htmlToText", () => {
  it("выбрасывает скрипты и стили вместе с содержимым", () => {
    const text = htmlToText("<p>до</p><script>alert(1)</script><p>после</p>");
    expect(text).not.toContain("alert");
    expect(text).toContain("до");
    expect(text).toContain("после");
  });

  it("переносит строки на месте блочных тегов", () => {
    expect(htmlToText("<p>раз</p><p>два</p>")).toBe("раз\nдва");
    expect(htmlToText("строка<br>вторая")).toBe("строка\nвторая");
  });

  it("схлопывает подряд идущие пустые строки", () => {
    expect(htmlToText("<p>раз</p><p></p><p></p><p>два</p>")).toBe("раз\n\nдва");
  });

  it("возвращает сущности к символам", () => {
    expect(htmlToText("<p>5 &lt; 7 &amp;&nbsp;8 &gt; 3</p>")).toBe(
      "5 < 7 & 8 > 3",
    );
  });

  it("на пустом входе отдаёт пустую строку", () => {
    expect(htmlToText("")).toBe("");
    expect(htmlToText("<div></div>")).toBe("");
  });
});
