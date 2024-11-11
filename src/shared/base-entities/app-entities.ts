import { Role } from "../../user/entities/role.entity";
import CaseFile from "../../case-file/entities/case-file.entity";
import FraudNumberEntity from "../../fraud-number/model/fraud-number.entity";
import Report from "../../report/model/report.entity";
import User from "../../user/entities/user.entity";
import { Comment } from "../../case-file/entities/comment.entity";
import { CaseFileStatus } from "../../case-file/entities/case-status.entity";
import { ActivityLog } from "../../log/entities/log-activity.entity";
import { ActivityLogType } from "../../log/entities/log-type.entity";
import { ConfigRule } from "../../config/config.entity";
import ReportThreshold from "../../report/model/report-threshold.entity";
import ReportPlatform from "../../report/model/report-platform";
import RiskLevel from "../../fraud-number/model/risk-level.entity";
import SubscriptionEntity from "../../notify-me/model/notify-me.entity";
import FeedbackEntity from "../../feedback/model/feedback.entity";
import OriginEntity from "../../statistics/model/origin.entity";


const ApplicationEntities = [
    Report,
    CaseFile,
    FraudNumberEntity,
    User,
    Role,
    Comment,
    CaseFileStatus,
    ActivityLog,
    ActivityLogType,
    ConfigRule,
    ReportThreshold,
    ReportPlatform,
    RiskLevel,
    SubscriptionEntity,
    FeedbackEntity,
    OriginEntity
];

export default ApplicationEntities;
