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
            name="AMLLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "source_type",
                    models.CharField(
                        choices=[("wallet", "Wallet"), ("mpesa", "M-Pesa")],
                        max_length=20,
                    ),
                ),
                ("source_reference", models.CharField(max_length=128)),
                ("amount_kes", models.DecimalField(decimal_places=2, max_digits=14)),
                ("threshold_kes", models.DecimalField(decimal_places=2, max_digits=14)),
                (
                    "transaction_state",
                    models.CharField(
                        choices=[
                            ("attempted", "Attempted"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="completed",
                        max_length=12,
                    ),
                ),
                (
                    "review_status",
                    models.CharField(
                        choices=[
                            ("flagged", "Flagged"),
                            ("reviewed", "Reviewed"),
                            ("escalated", "Escalated"),
                        ],
                        default="flagged",
                        max_length=12,
                    ),
                ),
                ("notes", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="aml_logs",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "AML Log",
                "verbose_name_plural": "AML Logs",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="amllog",
            constraint=models.UniqueConstraint(
                fields=("source_type", "source_reference"),
                name="unique_aml_log_source_reference",
            ),
        ),
    ]
