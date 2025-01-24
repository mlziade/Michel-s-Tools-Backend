import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

/**
 * Guard that checks for the presence and validity of an internal API key.
 * 
 * This guard retrieves the API key from the request headers and compares it 
 * against a stored key in Azure Key Vault. If the API key is missing or invalid, 
 * a ForbiddenException is thrown.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKeyHeader = request.headers['x-api-key'];
        if (apiKeyHeader == null) {
            throw new UnauthorizedException('API Key is required');
        }

        const apiKey = apiKeyHeader.toString();

        if (apiKey != process.env.INTERNAL_API_KEY) {
            throw new ForbiddenException('Invalid API Key');
        }

        return true;
    }
}