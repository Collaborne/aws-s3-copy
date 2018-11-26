import AWS from 'aws-sdk';
import { CopyObjectRequest, ServerSideEncryption } from 'aws-sdk/clients/s3';

// tslint:disable-next-line: no-var-requires
const URI = require('urijs');

const DEFAULT_SERVER_SIDE_ENCRYPTION = 'AES256';

export interface S3Copy {
	/**
	 * Copies an object within S3
	 * @param sourceKey Key of the to-be-copied object
	 * @param targetKey Key to where the object should be copied
	 */
	copyObject(sourceKey: string, targetKey: string): Promise<AWS.S3.CopyObjectOutput | AWS.AWSError>;
}

export class S3CopyImpl implements S3Copy {
	private s3: AWS.S3;
	private bucketName: string;

	constructor(bucketName: string, options: AWS.S3.Types.ClientConfiguration) {
		this.s3 = new AWS.S3(options);
		this.bucketName = bucketName;
	}

	/**
	 * Copies a file within one S3 bucket
	 *
	 * @param sourceKey Key of the S3 file that should be copied
	 * @param targetKey Key to where the S3 file should be copied
	 * @param serverSideEncryption Server side encryption option for newly placed file
	 * @return Promise that resolves once the copying is completed
	 */
	public async copyObject(
		sourceKey: string,
		targetKey: string,
		serverSideEncryption: ServerSideEncryption = DEFAULT_SERVER_SIDE_ENCRYPTION,
	): Promise<AWS.S3.CopyObjectOutput | AWS.AWSError> {
		const params: CopyObjectRequest = {
			Bucket: this.bucketName,
			CopySource: URI(`${this.bucketName}/${sourceKey}`).toString(),
			Key: targetKey,
			ServerSideEncryption: serverSideEncryption,
		};

		try {
			return await this.s3.copyObject(params).promise();
		} catch (e) {
			throw new Error(`Failed to copy object ${sourceKey} to bucket=${this.bucketName}, target=${targetKey} (${JSON.stringify(params)}): ${e.message}`);
		}
	}
}
