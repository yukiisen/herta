import { test, expect } from "bun:test";
import { getGithubImageUrl } from "../src/config";

test("Test Github username fetch", () => {
    const username = getGithubImageUrl();

    expect(username).not.toBe("face-hh");
})
