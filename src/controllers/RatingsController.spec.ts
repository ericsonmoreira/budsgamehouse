import { expect, test } from "vitest";
import TournamentController from "./TournamentController";

const tournamentMock: TournamentData = {
  name: "Teste",
  format: "pioneer",
  rounds: 4,
  players: [
    {
      id: "0cewGy1AEv0mlOYB8p9O",
      email: "rafaelgoncalves999@gmail.com",
      avatarImgUrl:
        "https://firebasestorage.googleapis.com/v0/b/atmcardhouse-e3c48.appspot.com/o/images%2F0cewGy1AEv0mlOYB8p9O?alt=media&token=c740ca78-5808-4d85-8576-9562d92be0f9",
      name: "Rafael Gonçalves",
    },
    {
      id: "7viFGxi9K3tFt1jrZksf",
      email: "alissonviana61@gmail.com",
      avatarImgUrl:
        "https://firebasestorage.googleapis.com/v0/b/atmcardhouse-e3c48.appspot.com/o/images%2F7viFGxi9K3tFt1jrZksf?alt=media&token=3ebd54da-2540-4b1b-9adc-aba7f526aad5",
      name: "Alisson Viana",
    },
    {
      id: "FjfeoVtzwBNRatWI62K0",
      avatarImgUrl: "",
      name: "Wellington Wendell",
      email: "welington_wendell@yahoo.com.br",
    },
    {
      id: "Fyvyynl9ezS4y0TmfWWt",
      avatarImgUrl:
        "https://firebasestorage.googleapis.com/v0/b/atmcardhouse-e3c48.appspot.com/o/images%2FFyvyynl9ezS4y0TmfWWt?alt=media&token=46bae127-93a3-4a72-bd41-9892e0ca835e",
      name: "Thalysson Santiago",
      email: "thasach@live.com",
    },
    {
      id: "Gksy9YCcVRqi00xGGbP4",
      avatarImgUrl: "",
      name: "Reuber Gadelha",
      email: "reubergadelha11@hotmail.com",
    },
    {
      id: "M0AxqGJospJVTnRQv32q",
      avatarImgUrl:
        "https://firebasestorage.googleapis.com/v0/b/atmcardhouse-e3c48.appspot.com/o/images%2FM0AxqGJospJVTnRQv32q?alt=media&token=3f7cfbde-18bc-414c-b306-bf107e2e1422",
      email: "avengersbook@gmail.com",
      name: "Gebson Mendes",
    },
    {
      id: "MGVgToJk1wPEe8Xem8hG",
      name: "Edson Alves",
      email: "edson.seya@gmail.com",
    },
    {
      id: "NLwZLtuaRIcLbp85RqMH",
      name: "Gleyson Barreto",
      email: "gleyson@borgesdecarvalho.com.br",
      avatarImgUrl:
        "https://firebasestorage.googleapis.com/v0/b/atmcardhouse-e3c48.appspot.com/o/images%2FNLwZLtuaRIcLbp85RqMH?alt=media&token=cefc1043-4574-4e4e-8da4-50d0e2df888b",
    },
  ],
  ratings: [],
};

test("start tests", () => {
  expect(tournamentMock).toBeTruthy();
});

test("Não pode ter partidas repetidas", () => {
  const tournamentController = new TournamentController(tournamentMock);

  const newMatches = tournamentController.getMatchesOfNewRound();

  tournamentMock.ratings.push(newMatches); //adicionando as matches

  expect(newMatches).toBeTruthy();

  expect(tournamentMock.ratings).toBeTruthy();

  expect(tournamentMock.ratings.length).toBe(1);

  expect(newMatches.length).toBe(
    tournamentController.tournamentData.players.length / 2
  );

  newMatches.forEach((match) => {
    const playersHaveFacedEachOther =
      tournamentController.playersHaveFacedEachOther(
        match.playersIds[0],
        match.playersIds[1]
      );

    expect(playersHaveFacedEachOther).toBeTruthy();
  });
});

