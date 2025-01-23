export class CreateUserContractRequest {
    firstName: string;
    lastName: string;
    username: string;
}

export class UpdateUserContractRequest extends CreateUserContractRequest {
    firstName: string;
    lastName: string;
}