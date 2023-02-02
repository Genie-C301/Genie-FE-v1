export interface UserData {
  name: string;
  discriminator: string;
  avatar: string;
  wallet: string;
  aptosWallets: string[];
}

export default class DiscordClient {
  BE_END_POINT: string;

  constructor() {
    this.BE_END_POINT = 'https://geniehot.link/graphql/';
  }

  async fetchGraphQL(operationsDoc: string, variables: any) {
    const result = await fetch(this.BE_END_POINT, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
      }),
    });

    return await result.json();
  }

  //query profile (discordId -> ATIV#9432, profileImgUrl, walletAddress)
  async fetchuserInfo(discordId: string): Promise<UserData> {
    console.log('discordId :', discordId);
    const graphqlQuery = `
      query GetUser($discordId :String!) {
        userInfo(discordId: $discordId) {
          name
          discriminator
          avatar
          aptosWallets {
            address
          }
        }
      }
    `;
    const variables = {
      discordId: discordId,
    };

    const data = await this.fetchGraphQL(graphqlQuery, variables);

    return data.data.userInfo;
  }

  //mutation verify (discordId -> walletAddress)
  async verifyUser(discordId: string, walletAddress: string) {
    const graphqlMutation = `
      mutation VerifyUser($discordId :String!, $walletAddress: String!) {
        verifyUser(discordId: $discordId, walletAddress: $walletAddress) {
          success
        }
      }
    `;

    console.log('inside', discordId, walletAddress);

    const variables = {
      discordId,
      walletAddress,
    };

    const data = await this.fetchGraphQL(graphqlMutation, variables);
    console.log('data', data);
    return data;
  }
}
