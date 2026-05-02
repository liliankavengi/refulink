from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="LoanRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("amount_kes", models.DecimalField(decimal_places=2, max_digits=12)),
                ("trust_score_at", models.PositiveSmallIntegerField()),
                ("status", models.CharField(
                    choices=[
                        ("pending",   "Pending"),
                        ("approved",  "Approved"),
                        ("repaid",    "Repaid"),
                        ("defaulted", "Defaulted"),
                    ],
                    default="pending",
                    max_length=12,
                )),
                ("repay_by", models.DateField(blank=True, null=True)),
                ("requested_at", models.DateTimeField(auto_now_add=True)),
                ("resolved_at", models.DateTimeField(blank=True, null=True)),
                ("user", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="loan_requests",
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={"ordering": ["-requested_at"]},
        ),
    ]
