import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { GalleryThumbnail } from './thumbnail.entity';
import { User } from './user.entity';

@Entity()
export class GalleryImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    fileName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 1024, nullable: false })
    s3Uri: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 63, nullable: false })
    bucketName: string;

    @Column({ type: 'text', nullable: false })
    objectKey: string;

    @Column({ type: 'text', nullable: false })
    objectUrl: string;

    @ManyToOne(() => User)
    createdBy: User;

    @OneToOne(() => GalleryThumbnail)
    @JoinColumn()
    thumbnail: GalleryThumbnail;
}