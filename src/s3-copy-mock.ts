import { S3Copy } from './s3-copy';

export class S3CopyMock implements S3Copy {
	public sourceKey: string | undefined;
	public targetKey: string | undefined;
	public copyObject(sourceKey: string, targetKey: string): Promise<any> {
		this.sourceKey = sourceKey;
		this.targetKey = targetKey;

		return Promise.resolve();
	}
}
