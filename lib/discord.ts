export interface UserData {
  userName: string;
  profileImgUrl: string;
  walletAddresses: string[];
}

export default class DiscordClient {
  BE_END_POINT: string;

  constructor(endpoint: string) {
    this.BE_END_POINT = endpoint;
  }

  async fetchGraphQL(
    operationsDoc: string,
    operationName: string,
    variables: any,
  ) {
    const result = await fetch(this.BE_END_POINT, {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });

    return await result.json();
  }

  //query profile (discordId -> ATIV#9432, profileImgUrl, walletAddress)
  async fetchUserProfile(discordId: string): Promise<UserData> {
    const graphqlQuery = `
      query fetchUser {
        user(
          discordId: ${discordId}
        ) {
          userName
          profileImg
          walletAddresses
        }
      }
    `;

    const data = await this.fetchGraphQL(graphqlQuery, 'fetchUser', {});

    return data.data;
  }

  //mutation verify (discordId -> walletAddress)
  async verifyWallet(discordId: string, walletaddress: string) {
    const graphqlQuery = `
      mutation verifyWallet {
        user(
          discordId: ${discordId}
          walletAddress: ${walletaddress}
        ) {
          success
        }
      }
    `;

    const data = await this.fetchGraphQL(graphqlQuery, 'fetchUser', {});
  }
}
