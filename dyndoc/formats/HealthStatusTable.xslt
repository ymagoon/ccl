<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
                xmlns:n="urn:com-cerner-patient-ehr:v3"
                xmlns:dd="DynamicDocumentation"
                xmlns:goalfx="urn:com-cerner-physician-documentation-goals-functions"
                xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
                exclude-result-prefixes="xsl xs fn cdocfx n dd xr-date-formatter goalfx">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!--Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/tablecommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="tablecommon.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/emrinfocommon.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="emrinfocommon.xslt" />-->

    <!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/patcaremeasurementcommon.xslt" />
    <!-- Uncomment this line to debug <xsl:include href="patcaremeasurementcommon.xslt" /> -->

    <xsl:variable name="HealthStatusHeading" as="xs:string" select="'General Health Status'"/>
    <xsl:variable name="DateHeading" as="xs:string" select="'Date Documented'"/>

    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion/n:measurement">

            <xsl:call-template name="emitTableStart">
                <xsl:with-param name="retainRowsInPlainText" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitHeadingStart">
                <xsl:with-param name="repeatHeadingOnPrintedPages" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$HealthStatusHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$DateHeading"/></xsl:call-template>

            <xsl:call-template name="emitHeadingEnd"/>

            <tbody>
                <xsl:call-template name="emitHealthStatusRows"/>
            </tbody>

            <xsl:call-template name="emitTableEnd"/>
            <xsl:value-of disable-output-escaping="yes" select="$newLine"/>

        </xsl:if>
    </xsl:template>

    <xsl:template name="emitHealthStatusRows">

        <xsl:for-each select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion/n:measurement">

            <xsl:sort select="@event-end-dt-tm" order="descending"/>

            <tr class="ddemrcontentitem ddremovable" style="page-break-inside: avoid;" dd:btnfloatingstyle="top-right">
                <xsl:if test="@event-id">
                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="@event-id"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>PATCARE_MEAS</xsl:text>
                </xsl:attribute>

                <!-- Emit health concern description -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:value != ''">
                    <xsl:choose>
                        <xsl:when test="n:value/n:blob and (n:value/n:blob/@text-format = 'ESCAPED_FO')">
                            <div>
                                <xsl:call-template name="tempOutputMeasurementValueInterpretation">
                                    <xsl:with-param name="measurement" select="."/>
                                    <xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
                                    <xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
                                    <xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
                                </xsl:call-template>
                            </div>
                        </xsl:when>
                        <xsl:otherwise>
                            <span style="padding-left: 15px;">
                                <xsl:call-template name="tempOutputMeasurementValueInterpretation">
                                    <xsl:with-param name="measurement" select="."/>
                                    <xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
                                    <xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
                                    <xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
                                </xsl:call-template>
                            </span>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit health status documented date -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@event-end-dt-tm">
                    <xsl:value-of select="cdocfx:getFormattedDateTime(n:event-end-dt-tm, $DATE_SEQUENCE)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>
            </tr>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
